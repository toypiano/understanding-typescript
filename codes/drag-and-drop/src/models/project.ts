// global & human-readable constant identifier
export enum ProjectStatus {
  Active,
  Completed,
}

export class Project {
  // constructor shorthand: accessor propName: type
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
