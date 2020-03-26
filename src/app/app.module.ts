import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import { ElectronEffects } from './effects/electron.effects';
import { BackEndEffects } from './effects/back-end.effects';
import { BlocklyEditorEffects } from './effects/blockly-editor.effects';
import { ConnectDialogComponent } from './dialogs/connect-dialog/connect-dialog.component';
import { DialogEffects } from './effects/dialog.effects';
import { RobotEffects } from './effects/robot.effects';

@NgModule({
  declarations: [
    AppComponent,
    ConnectDialogComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    // Initialize the Effects on startup
    {provide: APP_INITIALIZER, deps:
      [
        ElectronEffects,
        BackEndEffects,
        BlocklyEditorEffects,
        DialogEffects,
        RobotEffects
      ], useFactory: () => () => null, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConnectDialogComponent]
})
export class AppModule { }
