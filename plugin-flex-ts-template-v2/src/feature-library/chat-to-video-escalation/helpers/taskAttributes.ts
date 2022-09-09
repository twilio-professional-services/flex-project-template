/*
  Function to update the task attributes specific
  to tracking video room state
*/
export function updateTaskAttributesForVideo(task: any, status: string) {
  let attributes = task.attributes;
  let updatedAttributes = Object.assign(attributes, {
    videoRoom: status,
  });
  task.setAttributes(updatedAttributes);
}
