/* Project type */

// Drag & Drop Interfaces
interface Draggable {
  handleDragStart(e: DragEvent): void;
  handleDragEnd(e: DragEvent): void;
}

interface DragTarget {
  handleDragOver(e: DragEvent): void;
  handleDrop(e: DragEvent): void;
  handleDragLeave(e: DragEvent): void;
}

// global & human-readable constant identifier
enum ProjectStatus {
  Active,
  Completed,
}

class Project {
  // constructor shorthand: accessor propName: type
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

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
class ProjectState extends State<Project> {
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
    for (const listener of this.listeners) {
      listener(this.projects.slice()); // pass the copy (immutable pattern)
    }
  }
}

// we only have one instance of ProjectState in our entire application
const projectState = ProjectState.getInstance();

/* Validation */
interface Validatable {
  value: string | number;
  // validators are optional
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    // only string has trim and length
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  // validator check + type-guarding!
  // if minLength === 0, it becomes falsy even though it means the constraint of zero min-length.
  //
  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

function validateAll(...inputs: Validatable[]) {
  return inputs.every((v) => validate(v));
}

/* Decorators - enable "experimentalDecorators" in tsconfig.json */

// using underscore as argument name suppresses "noUnused" warnings
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const decoratedMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = decoratedMethod.bind(this);
      return boundFn;
    },
  };
  return updatedDescriptor;
}

/* Classes */

// Component Base Class
// abstract classes can never be instantiated but can only be extended
/**
 * Import an element from HTML template, add a className to it, then attach it to the host DOM element
 * @template T - Host DOM element to render U to
 * @template U - Element imported from HTML template.
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementClass?: string, // optional paramter must come at the end
    newElementId?: string
  ) {
    // get host element DOM node
    this.hostElement = document.getElementById(hostElementId)! as T;

    // "import" DOM node from template and configure
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementClass) {
      this.element.classList.add(newElementClass);
    }
    if (newElementId) {
      this.element.id = newElementId;
    }

    // attach imported element to the host element
    this.attach(insertAtStart);
  }
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
  // enforce child class to implement abstract methods
  abstract configure(): void;
  // Add additional contents to the imported template
  abstract renderContent(): void;
  // you cannot have private abstract class
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // input DOM nodes
  titleInputElement: HTMLInputElement; // becomes available with tsconfig.compilerOptions.lib: ["dom"]
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    // get DOM nodes and assign to public fields
    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;
    this.configure();
  }
  /**
   * Get input values, validate, and return them in a tuple.
   */
  private getUserInputs(): [string, string, number] | void {
    //returns tuple | void (if validation fails)
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = this.peopleInputElement.value;

    const title: Validatable = {
      value: titleValue,
      required: true,
    };
    const description: Validatable = {
      value: descriptionValue,
      required: true,
      minLength: 5,
    };
    const people: Validatable = {
      value: +peopleValue, // always convert numeric input value to number!!!
      required: true,
      min: 1,
      max: 99,
    };

    // not a reusable validation. only for now.
    if (!validateAll(title, description, people)) {
      alert('Please enter valid input!');
      return; // we have to return specified type(s)
    } else {
      return [titleValue, descriptionValue, +peopleValue];
    }
  }
  // usually put public method first
  renderContent() {} // boilerplate method to satisfy base class
  configure() {
    // add submit listener to form element
    // watchout for 'this' when passing methods to eventListeners
    this.element.addEventListener('submit', this.submitHandler);
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  /**
   * On submit, get input values and add them to the global state as a new project
   */
  @autobind // use decorator - otherwise we have to .bind(this) every time we use this method
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInputs = this.getUserInputs();
    if (Array.isArray(userInputs)) {
      // To destructure array element, you have to put inside the type-guard!
      const [title, desc, people] = userInputs;
      console.log(title, desc, people);
      // set state on singleton state instance
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  // property specific to this class
  assignedProjects: Project[];
  // ts constructor shorthand
  // not using ProjectStatus enum since we need this for string literal
  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `project--${type}`); // can't use this before super
    this.assignedProjects = [];
    // not calling these in the base class because
    // we might need to setup some dependencies after super()
    this.configure();
    this.renderContent();
  }

  /**
   * Listen to global state. When new project is added,
   * store filtered projects locally and render them.
   */
  configure() {
    // add listener: cb will be passed projects from state
    projectState.addListener((projects: Project[]) => {
      // callback will be called when new project is added to the state instance

      const filteredProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Completed;
      });
      this.assignedProjects = filteredProjects; // store state into local property to share across methods
      this.renderProjects();
    });
  }

  /**
   * Add header text and attach id to ul element
   */
  renderContent() {
    // this runs when ProjectList instantiates.
    // abstract private method is not available in ts
    const listId = `project-list--${this.type}`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  /**
   * Empty list element and append new list items from locally stored projects
   */
  private renderProjects() {
    // this will run when new project is added to the state
    const ulElement = document.getElementById(
      `project-list--${this.type}`
    )! as HTMLUListElement;
    // We could've diff DOM and only render difference but
    // they are expensive operations for this application.
    ulElement.innerHTML = '';
    for (const projectItem of this.assignedProjects) {
      // this.element is the section element
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }
}

/**
 * Creates list item to append to the ul element
 */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  // work with Project type since it has all the properties we need
  private project: Project;
  // set up your getter/setters below other class fields
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} people`;
    }
  }

  // hostElement is dynamically generated from ProjectList so we can't hard-code it.
  constructor(hostId: string, project: Project) {
    // we could've just create li instead of importing it from a template
    // since it's a single item without any nesting elements,
    // but to use the base class, Component, you have to work with a template
    // (and we ended up nesting more structures within the template)
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  @autobind
  handleDragStart(e: DragEvent) {
    console.log(e);
  }
  handleDragEnd(_: DragEvent) {
    console.log('dragend');
  }

  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart);
    this.element.addEventListener('dragend', this.handleDragEnd);
  }
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    // use getter just like regular property
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

// Instantiate to render
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const completedProjectList = new ProjectList('completed');
