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
import effects from '../effects';
import {SidebarComponent} from './sidebar/sidebar.component';
import {GalleryComponent} from './gallery/gallery.component';
import {CategoryInputComponent} from './category-input/category-input.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    GalleryComponent,
    CategoryInputComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot(effects)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
