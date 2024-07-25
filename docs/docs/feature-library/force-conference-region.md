---
sidebar_label: force-conference-region
title: force-conference-region
---

This feature provides adds the ability to set the _conference region_ which is used by Flex when a call task is accepted to establish a conference. By default the conference is established based on the incoming call Region/Edge which is generally the lowest latency to the caller. 

## Overview
In certain circumstances the region that is chosen when the conference is established may be incorrect. This can occur when a call has been transferred into Twilio from another Twilio account using the `<Application/>` TwiML verb. 

For example, in this scenario a call that lands on an edge (e.g. Sydney in AU1 region) in Account A may be transferred to a Flex agent in Account B (also connected to the Sydney edge in AU1).  The transfer of the call uses the Application Connect method to send the call between accounts. Currently, outbound call leg via Application Connect will default to Ashburn (US1), consequently the inbound leg to Account B also shows the Ashburn edge. In this scenario when the call is presented to the agent, Flex will by default choose a low latency conference resource and use the US1 region, even if the agent is connected to a different edge.

## Configuration
Currently the conference API does not support the `edge` parameter, hence the legacy `region` parameter is used instead. 

Only Twilio regions (not interconnect regions) may be used, see the complete list [here](https://www.twilio.com/docs/global-infrastructure/edge-locations/legacy-regions)

## How it works
This plugin provides a workaround to this issue by setting the `conferenceOptions.region` parameter to a _region_ that is specified by the plugin.
