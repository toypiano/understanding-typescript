/* Project type */

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
type Listener<T> = (items: T[]) => void;
/**
 * Create singleton state instance
 */

class State<T> {
  // protected properties are used to extend private properties
  // private properties in base classes cannot be accessed in inheriting classes.
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  // start out by setting type as any
  private projects: Project[] = [];
  private static id: number;

  // ts singleton pattern
  private static instance: ProjectState;

  private constructor() {
    super();
    ProjectState.id = 0;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

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
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // pass the copy (immutable pattern)
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
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementClass?: string // optional paramter must come at the end
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementClass) {
      this.element.classList.add(newElementClass);
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
  // enforce child class to implement this method
  abstract configure(): void;
  abstract renderContent(): void;
  // you cannot have private abstract class
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
  // this runs when ProjectList instantiates.
  renderContent() {
    // abstract private method is not available in ts
    const listId = `project-list--${this.type}`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    // this will run when new project is added to the state
    const ulElement = document.getElementById(
      `project-list--${this.type}`
    )! as HTMLUListElement;
    // We could've diff DOM and only render difference but
    // they are expensive operations for this application.
    ulElement.innerHTML = '';
    for (const projectItem of this.assignedProjects) {
      // create elem, inject data, then render
      const li = document.createElement('li');
      li.textContent = projectItem.title;
      ulElement.appendChild(li);
    }
  }
}

/**
 * Get user input value and populate template with it and render template
 */
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // became available with tsconfig.compilerOptions.lib: ["dom"]
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    // populating fields with DOM elements
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
    if (!validate(title) || !validate(description) || !validate(people)) {
      alert('Please enter valid input!');
      return; // we have to return specified type(s)
    } else {
      return [titleValue, descriptionValue, +peopleValue];
    }
  }
  // usually put public method first
  renderContent() {} // mock method to satisfy base class
  configure() {
    // add listeners to elements
    // watchout for 'this' when adding eventListeners
    this.element.addEventListener('submit', this.submitHandler);
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  // use decorator - otherwise we have to .bind(this) every time we use this method
  @autobind
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

// Instantiate to render
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const completedProjectList = new ProjectList('completed');
