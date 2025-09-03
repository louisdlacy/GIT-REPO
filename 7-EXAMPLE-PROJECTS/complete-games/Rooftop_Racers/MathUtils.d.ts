/**
 * Contains helper classes for advanced Math functions
 */
import { Quaternion, Vec3 } from "horizon/core";
export declare const Deg2Rad: number;
export declare const Rad2Deg: number;
export declare function acuteAngleBetweenVecs(v1: Vec3, v2: Vec3): number;
export declare function getClockwiseAngle(v1: Vec3, v2: Vec3): number;
export declare function getForward(rotation: Quaternion): Vec3;
