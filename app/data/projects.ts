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
    title: "Project 1",
    image: "/images/project1.jpg",
    width: 400,
    height: 480,
  },
  {
    id: 2,
    title: "Project 2",
    image: "/images/project2.jpg",
    width: 600,
    height: 320,
  },
  {
    id: 3,
    title: "Project 3",
    image: "/images/project3.jpg",
    width: 450,
    height: 540,
  },
  {
    id: 4,
    title: "Project 4",
    image: "/images/project4.jpg",
    width: 550,
    height: 400,
  },
  {
    id: 5,
    title: "Project 5",
    image: "/images/project5.jpg",
    width: 500,
    height: 480,
  },
  {
    id: 6,
    title: "Project 6",
    image: "/images/project6.jpg",
    width: 480,
    height: 360,
  },
  {
    id: 7,
    title: "Project 7",
    image: "/images/project7.jpg",
    width: 420,
    height: 520,
  },
  {
    id: 8,
    title: "Project 8",
    image: "/images/project8.jpg",
    width: 580,
    height: 380,
  },
];
