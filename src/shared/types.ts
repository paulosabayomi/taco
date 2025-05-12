export interface IMainState extends IMainInternal {
  set_state: (title: keyof IMainInternal, value: any) => void;
}

export interface IMainInternal {
    tasks: TTask[];
}

export type TTask = {
    title: string;
    duration: number;
}