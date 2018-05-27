import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';


import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {reducers} from '../reducers';
import {HeaderComponent} from './header/header.component';
import {ArticlesEffects} from '../effects/articles.effects';
import {DBService} from '../db';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([ArticlesEffects])
  ],
  providers: [DBService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
