import { Project, ProjectStatus } from '../models/project';

/**
 * Function that takes an array of data objects and creates some effects with it.
 */
type Listener<T> = (items: T[]) => void;

class State<T> {
  // static field only because we're not directly instantiating State
  /**
   * array of Listeners
   * @protected
   */
  protected listeners: Listener<T>[] = [];
  /**
   * Public method that takes a Listener and adds it to the listeners property.
   * @param listener
   * @public
   */
  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

export class ProjectState extends State<Project> {
  // store instance inside class
  private static instance: ProjectState;
  private static count: number = 0;
  private projects: Project[] = [];

  private constructor() {
    super();
  }
  /**
   * Return a singleton instance of ProjectState
   */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      'id' + (ProjectState.count++).toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.callListenersWithNewProjects();
    console.log(this.projects);
  }

  moveProject(id: string, targetStatus: ProjectStatus) {
    const movingProject = this.projects.find((p) => p.id === id);
    if (movingProject && movingProject.status !== targetStatus) {
      movingProject.status = targetStatus;
      this.callListenersWithNewProjects();
    }
  }

  private callListenersWithNewProjects() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

export const state = ProjectState.getInstance();
