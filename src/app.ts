/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  // Instantiate to render
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('completed');
}
