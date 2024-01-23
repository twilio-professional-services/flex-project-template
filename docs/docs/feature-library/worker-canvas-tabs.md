---
sidebar_label: worker-canvas-tabs
title: worker-canvas-tabs
---

## Overview

This feature converts the sections within the worker canvas (such as the skills section) into selectable tabs. This improves the user experience by reducing the amount of scrolling required, especially with multiple sections present.

## How does it work?

This feature takes advantage of the `addWrapper` API in Flex UI, which allows wrapping a component (in this case, `WorkerCanvas`) with something custom. To add individual tabs within this wrapper, each `WorkerCanvas` component fragment is also wrapped with a Paste `Tab` component.

To specify the tab title to use for each component, when adding a component to `WorkerCanvas`, the `tabTitle` option can be specified with the desired string to display, for example:

```ts
Flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />, {
  tabTitle: "Capacity",
});
```

If no title is provided, the component's unique `key` is used instead.

## Setup

This feature can be enabled via the `flex-config` attributes by setting the `worker_canvas_tabs` `enabled` flag to `true`. 

## Flex User Experience

![WorkerDetails](/img/features/worker-canvas-tabs/worker-canvas-tabs.png)

