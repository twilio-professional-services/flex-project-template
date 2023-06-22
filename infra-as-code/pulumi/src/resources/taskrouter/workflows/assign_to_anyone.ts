
import * as pulumi from '@pulumi/pulumi';

export default ({ queues }) => ({
    resource: ["taskrouter", { "workspaces": process.env.FLEX_WORKSPACE_SID }, "workflows"],
    attributes: {
        friendlyName: 'Assign To Anyone',
        configuration: pulumi.all([
            queues.everyone,
        ])
            .apply(([
                everyone_sid,
            ]) => JSON.stringify(
                {
                    task_routing: {
                        filters: [
                            // {
                            //     friendlyName: `Filter Name`,
                            //     expression: `(taskAttrbute == 'value')`,
                            //     targets: [
                            //         {
                            //             queue: queueName_sid,
                            //             order_by: `worker.routing.levels.skill DESC`,
                            //             expression: `worker.routing.skills HAS skill`
                            //         }   
                            //     ]
                            // },
                        ],
                        default_filter: {
                            queue: everyone_sid
                        }
                    }
                }
            ))
    }
})
