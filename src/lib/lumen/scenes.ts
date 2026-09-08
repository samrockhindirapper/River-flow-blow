export type SceneId = "rain" | "forest" | "cafe" | "coast";

export type Scene = {
  id: SceneId;
  name: string;
  sound: string;
  src: string;
  fallback: string;
};

export const SCENES: Scene[] = [
  {
    id: "rain",
    name: "Loft rain",
    sound: "Rain on glass",
    src: "/scenes/rain.jpg",
    fallback: "linear-gradient(180deg, #1a2230 0%, #0c0d10 55%, #14110e 100%)",
  },
  {
    id: "forest",
    name: "Pine dusk",
    sound: "Wind in pines",
    src: "/scenes/forest.jpg",
    fallback: "linear-gradient(180deg, #6a7a72 0%, #243028 50%, #101412 100%)",
  },
  {
    id: "cafe",
    name: "Night cafe",
    sound: "Quiet room",
    src: "/scenes/cafe.jpg",
    fallback: "linear-gradient(180deg, #2a241c 0%, #161310 55%, #0c0b0a 100%)",
  },
  {
    id: "coast",
    name: "Sea fog",
    sound: "Low tide",
    src: "/scenes/coast.jpg",
    fallback: "linear-gradient(180deg, #8a939c 0%, #4a5560 40%, #1a1e24 100%)",
  },
];

export function sceneById(id: SceneId): Scene {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

export function nextSceneId(id: SceneId, dir: 1 | -1): SceneId {
  const i = SCENES.findIndex((s) => s.id === id);
  const n = SCENES.length;
  return SCENES[(i + dir + n) % n].id;
}
