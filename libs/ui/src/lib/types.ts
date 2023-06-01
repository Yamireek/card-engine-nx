import { Texture } from 'three';

export type Vector2 = [number, number];

export type Vector3 = [number, number, number];

export type CardTextures = { front: Texture; back: Texture };

export type Dimensions = { width: number; height: number };

export type Dimensions3 = { width: number; height: number; depth: number };
