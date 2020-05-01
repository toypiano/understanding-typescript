import { Project, ProjectStatus } from '../models/project.js';

/* State Management */

// using type to denote function type in one line.
// we don't usually care about return values from listener
// because it generally takes some value and create some side-effects with it.
/**
 * Listener functions that is passed an array of class T instances
 * @template T A class instance to store in items.
 * @param items An array of instances to pass into a listener function.
 */
type Listener<T> = (items: T[]) => void;
/**
 * Create singleton state instance
 */

class State<T> {
  // protected fields are used to extend private fields
  // private fields in base classes cannot be accessed in child classes.
  protected listeners: Listener<T>[] = [];
  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

/**
 * Creates a state instance using singleton pattern
 */
export class ProjectState extends State<Project> {
  // state is only available through listeners from the outside
  private projects: Project[] = [];
  private static id: number = 0;

  // can't access outside class
  // doesn't exist in instance
  private static instance: ProjectState;

  // can't instantiate with 'new' from outside
  private constructor() {
    super();
  }

  // if instance exists, return it.
  // if not, create and return it.
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // public instance method
  /**
   * Add a new Project to state and
   * call all added listeners, passing in updated state.
   * @param title project title
   * @param description project description
   * @param people number of people in project
   */
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      (ProjectState.id++).toString(),
      title,
      description,
      people,
      ProjectStatus.Active // by default
    );

    this.projects.push(newProject);
    // When adding new project, loop through listeners and call them passing in the project list
    this.updateListeners();
  }

  /**
   * Changes project status
   */
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((p) => p.id === projectId);
    // avoid re-render if status didn't change
    // (user dropped item back to the same list)
    // but this will still add 'droppable' class handled from 'dragover` event.
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      // you have to call listeners again with the updated state
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener(this.projects.slice()); // pass the copy (immutable pattern)
    }
  }
}

// this only prints once
console.log('instantiating projectState...');
// we only have one instance of ProjectState in our entire application
export const projectState = ProjectState.getInstance();
