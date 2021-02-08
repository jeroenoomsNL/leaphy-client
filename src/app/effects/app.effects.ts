import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';
import { BackEndState } from '../state/backend.state';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusMessageDialog } from '../modules/core/dialogs/status-message/status-message.dialog';
import { Router } from '@angular/router';
import { UserMode } from '../domain/user.mode';

@Injectable({
    providedIn: 'root',
})

export class AppEffects {
    private isDebug = false;
    constructor(
        private appState: AppState,
        private translate: TranslateService,
        private backEndState: BackEndState,
        private snackBar: MatSnackBar,
        private router: Router) {

        // Set the default language as default
        this.appState.defaultLanguage$
            .subscribe(language => this.translate.setDefaultLang(language));

        // Use the selected language to translate
        this.appState.selectedLanguage$
            .subscribe(language => this.translate.use(language));


        this.appState.userMode$
            .subscribe(userMode => {
                switch (userMode) {
                    case UserMode.Beginner:
                        this.router.navigate(['']);
                        break;
                    case UserMode.Advanced:
                        this.router.navigate(['/advanced']);
                        break;
                    default:
                        break;
                }
            });
        // Enable to debugging to console.log all backend messages
        this.backEndState.backEndMessages$
            .pipe(filter(() => this.isDebug))
            .subscribe(message => console.log(message));

        // Show snackbar based on messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message && message.displayTimeout >= 0))
            .subscribe(message => {
                this.snackBar.openFromComponent(StatusMessageDialog, {
                    duration: message.displayTimeout,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    data: message
                })
            });
    }
}