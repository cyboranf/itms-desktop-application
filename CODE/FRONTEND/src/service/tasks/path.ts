export enum Paths {
  TASKS = '/tasks',
  TASKS_ID = '/tasks/{id}',
  RAPORT = '/generate-task-report',
  TASK_TYPE = '/tasks/types',
  TASK_PRODUCT = '/tasks/{taskId}/join/products/{producId}',
  TASK_USER = '/users/{userId}/join/tasks/{taskId}',
  TASK_SELF = '/tasks/self/assigned',
  TASK_FINISHED = '/tasks/{taskId}/finished'
}

