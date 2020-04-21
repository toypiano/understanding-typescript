/* 
Goal:
1. get the user input value
2. populate template with data
3. render it
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
    this.formElement.id = 'user-input'; // interacting with element

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

  private submitHandler(e: Event) {
    e.preventDefault();
    console.log(this.titleInputElement.value);
  }

  // add listeners to elements
  private configure() {
    // watchout for 'this' when adding eventListeners
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
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
