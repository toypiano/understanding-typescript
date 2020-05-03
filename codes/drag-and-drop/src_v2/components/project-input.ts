import { Component } from './base-component';
import { autobind } from '../decorators/autobind';
import { state } from '../state/project-state';
import { Validatable, validate } from '../utils/validation';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    super('project-input', 'app', true, undefined, 'user-input');
    this.titleInputElement = document.getElementById(
      'title'
    )! as HTMLInputElement;
    this.descriptionInputElement = document.getElementById(
      'description'
    )! as HTMLInputElement;
    this.peopleInputElement = document.getElementById(
      'people'
    )! as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.element.addEventListener('submit', this.handleFormSubmit);
  }
  renderContent() {}

  private getUserInputs(): [string, string, number] | void {
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
      minLength: 4,
    };
    const people: Validatable = {
      value: peopleValue,
      required: true,
      min: 1,
      max: 99,
    };
    if (validate(title, description, people)) {
      return [titleValue, descriptionValue, +peopleValue];
    } else {
      alert('Invalid input!');
    }
  }

  @autobind
  private handleFormSubmit(e: Event) {
    e.preventDefault();
    const userInputs = this.getUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      state.addProject(title, description, people);
    }
    this.clearInputs();
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}
