/*
  Function to update the task attributes specific
  to tracking video room state
*/
export function updateTaskAttributesForVideo(task: any, status: string) {
  const { attributes } = task;
  const updatedAttributes = Object.assign(attributes, {
    videoRoom: status,
  });
  task.setAttributes(updatedAttributes);
}
