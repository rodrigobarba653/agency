export interface Project {
  id: number;
  title: string;
  image: string;
  width: number;
  height: number;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Amazon - Futbol",
    image: "/images/projects/amazon/cover.jpg",
    width: 500,
    height: 281, // 16:9 aspect ratio (1920x1080)
  },
  {
    id: 2,
    title: "Royal Canin - CVDL",
    image: "/images/projects/royalcanin/cover.jpg",
    width: 500,
    height: 750, // 2:3 aspect ratio (720x1080)
  },
  {
    id: 3,
    title: "Natura - Aura",
    image: "/images/projects/natura/cover.jpg",
    width: 500,
    height: 421, // Aspect ratio (1281x1080)
  },

  {
    id: 4,
    title: "Honor Talents 2025",
    image: "/images/projects/talent/cover.jpg",
    width: 500,
    height: 667, // Aspect ratio (810x1080)
  },
];
