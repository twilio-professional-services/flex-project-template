---
sidebar_label: serverless-schedule-manager
sidebar_position: 7
title: serverless-schedule-manager
---

This package manages the serverless functions specific to the _schedule-manager_ feature. This package is separate from the `serverless-functions` package due to the actual schedule manager configuration being part of this serverless package--the entire service is re-deployed upon each configuration publish. If you are deploying the schedule-manager feature, you will need to also deploy this package using the instructions in the [schedule-manager feature page](/feature-library/schedule-manager). If you are not deploying the `schedule-manager` feature, this service will not be used and does not need to be deployed.
