import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { WatchRoomComponent } from './watch-room/watch-room.component';
import { StreamRoomComponent } from './stream-room/stream-room.component';

@NgModule({
  declarations: [
    AppComponent,
    ListRoomsComponent,
    WatchRoomComponent,
    StreamRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
