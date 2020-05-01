/// <reference path="./base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}
