# React test task (August 2023)

# The goal

The goal of the task is to implement a frontend part of a very simple game. To put it briefly: the player controls the drone, which goes down the flexuous cave. There are only two outcomes: either drone reaches the cave exit (winning scenario), or the drone crashes into the cave wall (loosing scenario).

# The instruments

The task solution should be implemented using React. You are free to use any state management library you see fit. You can also use any component library you familiar with to build forms/popups (there aren’t many in this task). You cannot use graphic libraries like Three.js. The graphical (cave/drone visualisation) part of this task needs to be implemented from scratch. It is advised (although not necessary) to use SVG primitives for this part.

# The cave

The cave is being generated on the server (see below). The cave shape data format is very simple: it is the pairs of numbers, describing the coordinates of the openings in the cave along its length. The total width of a “canvas”, which server “draws” the cave on is `500`. Each pair of numbers describes the left and right opening coordinate **relative to the center** of the server “canvas”. For example, the following pairs:

| -72,70 |
| --- |
| -73,69 |
| -75,67 |
| -77,64 |
| -80,61 |

are describing the cave segment which might look something like this:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled.png)

Note two things:

1. Walls have height. On the image above the height of the walls is `10` pixels. Points, which represent the walls coordinates, are connected by the lines to make the cave walls look smooth.
2. Server doesn’t care about the height of the walls; it’s up to the client to determine it (and this decision will influence the difficulty level and the perceived length of the cave).

# The drone

The drone is represented by the triangle pointing down:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%201.png)

Drone is “stuck” at the top of the viewport and visually only able to move left and right. Vertical drone movement is represented visually by the cave moving up.

The decision on the drone size is free for you to decide; consider making it configurable internally to experiment with the gameplay. 

Both horizontal/vertical initial speed of a drone are `0`.

# The gameplay

The general gameplay loop is as follows:

1. Player should be greeted with the scoreboard (see below) and the button to start playing.
2. Player has been asked for a name and also asked to choose the desired difficulty level (`0-10`). This could be done in the popup form, for example.
3. Client performs the initial data loading (see below) while showing the player some kind of a loading indicator.
4. Client displays the cave and the drone. Very crude representation might look like this:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%202.png)

1. Client allows the player to control the drone using the arrow keys. Pressing left/right keys should increment/decrement the horizontal drone speed. Pressing up/down keys should increment/decrement the vertical drone speed. The increment values and the limits for drone speed parameters are up to you to decide (considering the gameplay fun factor). Visually drone will be moving only horizontally. Vertically drone stays in place, and it looks like the cave is moving instead.
2. Client should also display two gauges which represent the drone vertical (can be only positive) and horizontal (negative for going left, positive for going right) speed. They might look something like a car speedometers.
3. Client should display the current player score. Score is incremented each time the drone passes the wall segment. Possible formula to calculate **the score increment**: `scoreMultiplier * droneVerticalSpeed + complexity` (`scoreMultiplier` is some static multiplier, other parameters speaks for themselves). You might come up with better formula through experiments. The formula should account for the chosen difficulty level (complexity) and for the drone speed (the faster the drone moves, the greater the score increment).
4. If the drone collided with the cave wall, the “the drone has been destroyed” popup should be displayed.
5. If the drone successfully reached the end of a cave, the “congratulations” popup should be displayed.
6. After the player confirmed either “loosing” or “winning” popup, he should be taken back to the scoreboard.
7. Internally, the game should store the game sessions data (player name / difficulty level / final score) inside the local storage; and display all this data on the scoreboard ordered by the highest score.

# The collision

Ideally, you want to implement the proper collision detection. For example, the algorithm should be able to detect the following cases:

1. Nose collision:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%203.png)

1. Back collision:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%204.png)

1. Side collision:

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%205.png)

Implementing such algorithm (and understanding how it works) would be a big plus.

But it would be OK to implement a simpler collision detection algorithm: for the sake of the algorithm (not visually) threat the drone as a rectangle and the wall segments as a rectangles as well. Then detect whether the rectangles are colliding (it should be much easier).

# The client-server interaction

The server part of the game have a pretty strange interaction protocols. All the details are described in the next section, but the general flow is as follows:

1. Client should initiate the game session by passing player name and desired difficulty level to the `/init` endpoint. Client will receive the player id in return.
2. Client should exchange the player id with the player token. Unfortunately, the server is unable to return the token (long string) in one piece, so the client needs to make 4 separate calls to the `/token/:chunkNo` endpoint and concatenate received token parts into the whole token string. The important point here is that each `/token/:chunkNo` call is quite time-consuming, so ideally the client should initiate them all simultaneously (server is able to process them simultaneously as well).
3. Client should initiate the WebSocket connection with the `/cave` endpoint, pass the player id and player token in the first message, and receive the cave shape data from the server through the WebSocket connection. The tricky part here is that server sends each cave data pair one at a time at a static rate (approximately each 10ms), so client **should not** wait for all the data to arrive. Client should receive just enough data to be able to draw the initially visible part of the cave (considering the walls height and the client viewport height), and allow player to control the drone while still fetching the rest of the cave data from the server.

# The server

The server part (already implemented at `cave-drone-server.shtoa.xyz`) is responsible for a cave generation.

## HTTP endpoints

Base URL is `https://cave-drone-server.shtoa.xyz`.

### POST `/init`

Initialise the game.

Expects the following parameters in JSON-encoded body:

- `name` (player name)
- `complexity` (game complexity, number from `0` to `10`)

Response is the JSON-encoded object, which contains the single field `id`  (player id, looks like a string of random characters).

Might return `400` status code in case if there is something wrong with the request parameters.

### GET `/token/:chunkNo`

Get the chunk of a player’s token. The `chunkNo`  parameter is the index (`1-4`) of the chunk.

This endpoint is unbearably slow.

Expects the following query parameters:

- `id` (player id)

Response is the JSON-encoded object, which contains:

- `no` (chunk index, just returned back)
- `chunk` (token chunk itself, looks like a string of random characters)

## WebSocket endpoint

Base URL is `wss://cave-drone-server.shtoa.xyz`.

### `/cave`

Receive the cave shape data.

After establishing the WebSocket connection at `wss://cave-drone-server.shtoa.xyz/cave`, as a first message client needs to pass the following string: `player:[id]-[token]`, where `[id]` is the player id received from HTTP `/init` endpoint, and `[token]` is the player token, assembled from the calls to the `/token/:chunkNo` endpoint (see above). Passing client payload in any other format, or passing the non-existent player id / player token will result in immediate WebSocket disconnection.

After server received and successfully validated player id and token, it will start sending the cave shape data through the WebSocket connection. Each message represents the coordinates of the next measured cave opening. The format of each message is very simple: `[left-wall-position],[right-wall-position]`, where both positions are numbers, representing the coordinates of the walls. 

After all cave data has been sent, server will send the `finished` message through the WebSocket, and also will close the connection.

![Untitled](React%20test%20task%20(August%202023)%20d8f1036944af4017aa7bcc1f89ca319c/Untitled%206.png)