/* Project type */

// global & human-readable constant identifier
enum ProjectStatus {
  Active,
  Finished,
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
type Listener = (items: Project[]) => void;
/**
 * Create singleton state instance
 */
let id = 0;
class ProjectState {
  // start out by setting type as any
  private listeners: Listener[] = [];
  private projects: Project[] = [];

  // ts singleton pattern
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      (id++).toString(),
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

class ProjectList {
  templateElement: HTMLTemplateElement;
  app: HTMLDivElement;
  sectionElement: HTMLElement;
  assignedProjects: Project[];
  // ts constructor shorthand
  constructor(private type: 'active' | 'completed') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.app = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.sectionElement = importedNode.firstElementChild as HTMLFormElement;
    this.sectionElement.classList.add(`project--${this.type}`);

    // add listener: cb will be passed projects from state
    projectState.addListener((projects: Project[]) => {
      // callback will be called when new project is added to the state instance
      this.assignedProjects = projects; // store state into local property to share across methods
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    // this will run when new project is added to the state
    const ulElement = document.getElementById(
      `project-list--${this.type}`
    )! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      // create elem, inject data, then render
      const li = document.createElement('li');
      li.textContent = projectItem.title;
      ulElement.appendChild(li);
    }
  }

  // this runs when ProjectList instantiates.
  private renderContent() {
    const listId = `project-list--${this.type}`;
    this.sectionElement.querySelector('ul')!.id = listId;
    this.sectionElement.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.app.insertAdjacentElement('beforeend', this.sectionElement);
  }
}

/**
 * Get user input value and populate template with it and render template
 */
class ProjectInput {
  // became available with tsconfig.compilerOptions.lib: ["dom"]
  templateElement: HTMLTemplateElement;
  app: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // select this element which is not null and of HTMLTemplateElement type.
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    // typecasting with 'as' (you could also use <> before the expression)
    this.app = document.getElementById('app')! as HTMLDivElement;

    // when this class creates an instance, we want to immediately render the form that belongs to this element. So we'll do it in the constructor.
    const importedNode = document.importNode(
      this.templateElement.content,
      true //deep=true
    ); // returns DocumentFragment

    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    // write css first, then add id (or class) to the element before render
    this.formElement.classList.add('user-input'); // interacting with element

    // populating fields with DOM elements
    this.titleInputElement = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
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

  // add listeners to elements
  private configure() {
    // watchout for 'this' when adding eventListeners
    this.formElement.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    // beforebegin = before(elm)
    // afterbegin = prepend(elm)
    // beforeend = appendChild(elm)
    // afterend = after(elm)
    this.app.insertAdjacentElement('afterbegin', this.formElement);
  }
}

// Instantiate to render
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const completedProjectList = new ProjectList('completed');
