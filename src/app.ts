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
  constructor() {
    // select this element which is not null and of HTMLTemplateElement type.
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    // typecasting with as (you could also use <> before the expression)
    this.app = document.getElementById('app')! as HTMLDivElement;

    // when this class creates an instance, we want to immediately render the form that belongs to this element. So we'll do it in the constructor.
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); //deep=true
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.attach();
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
