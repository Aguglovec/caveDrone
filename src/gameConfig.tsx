import { coordinate2D } from "./types/types";

//API
export const API_URL : string = `https://cave-drone-server.shtoa.xyz`;
export const WS_API_URL : string = `wss://cave-drone-server.shtoa.xyz/cave`;
export const tokenChunks : number = 4;

export const canvasX : number = 500;
export const canvasY : number = 500;
export const timeDelay : number = 10;
export const caveSectionHeight : number = 10;
export const droneCoordinates : coordinate2D[] = [{x:-10, y:0},{x:0, y:17},{x:10, y:0},];


//styles
export const boardColor : string  = "#222222";
export const droneColor : string  = "#00ff00";
export const caveColor : string  = "#999999";

//store
export const STORAGE_KEY : string  = "CaveDroneData";
export const testScoreList  = [
    {name:"Alex",
    score:999,},
    {name:"LiLu",
    score:900,},
    {name:"Zorg",
    score:800,},
    {name:"Corben",
    score:700,},
    {name:"Multipass",
    score:600,},
    {name:"Alex",
    score:500,},
    {name:"Alex",
    score:400,},
    {name:"Alex",
    score:300,},
    {name:"Alex",
    score:200,},
    {name:"Alex",
    score:100,},
];
