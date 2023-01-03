# supervisor-complete-reservation

This feature provides the supervisor the ability to remotely complete an agents reservation that is in the wrapping status.

# flex-user-experience

a supervisor remotely completing a task that has been sitting in a wrap up state for too long

![alt text](screenshots/complete-reservation.gif)

# setup and dependencies

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

To enable the `Supervisor Complete Reservation` feature, under the `flex-config` attributes set the `supervisor_complete_reservation` `enabled` flag to `true`.

```json
"supervisor_complete_reservation": {
  "enabled": true
}
```

# how does it work?

When enabled, this feature adds a button to the TaskOverviewCanvas that when clicked opens a dialog to confirm the completion of the task. Upon confirmation a request is made to a twilio function that takes the task sid and reservation id and updates the reservation to the completed state.
