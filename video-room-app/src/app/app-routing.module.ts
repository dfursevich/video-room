import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { WatchRoomComponent } from './watch-room/watch-room.component';
import {StreamRoomComponent} from "./stream-room/stream-room.component";

const routes: Routes = [
  { path: '', redirectTo: '/rooms', pathMatch: 'full' },
  { path: 'rooms', component: ListRoomsComponent },
  { path: 'watch/:room', component: WatchRoomComponent },
  { path: 'stream/:room', component: StreamRoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
