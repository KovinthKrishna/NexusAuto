import {create} from "zustand";
import { Vehicle } from "./vehicleStore";


export interface Project {
    _id: string;
    vehicle: Vehicle[];
    appointmentId: string;
    serviceType: string;
    status:"In Progress" | "Completed" | "On Hold" | "Pending"; // added Pending for not yet accepted
    projectType: "Service" | "Modification";
    startDate: string;
    endDate?: string | null;
    notes?: string;
    }

interface  ProjectsStore {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
// Store-only operations (work on state only)


    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProjectStatus: (projectId: string, newStatus: Project["status"]) => void;
    removeProject: (projectId: string) => void;


    // helpers
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectsStore>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  addProject: (project) => {
    set((state) => ({ projects: [project, ...state.projects] }));
  },

  updateProjectStatus: (projectId, newStatus) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === projectId ? { ...p, status: newStatus } : p
      ),
    }));
  },

  removeProject: (projectId) => {
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== projectId),
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

export const useProjects = () => {
  const { projects, isLoading, error } = useProjectStore();
  return { projects, isLoading, error };
};

export const useProjectActions = () => {
  const { addProject, setProjects, updateProjectStatus, removeProject, setLoading, setError } =
    useProjectStore();
  return { addProject, setProjects, updateProjectStatus, removeProject, setLoading, setError };
};