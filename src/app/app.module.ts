//Modules
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  	    MatCardModule, MatButtonModule, MatIconModule,MatDialogModule,
  	    MatCheckboxModule, MatInputModule, MatMenuModule, MatTabsModule, 
  			MatGridListModule, MatListModule, MatToolbarModule, MatSelectModule, 
  			MatSidenavModule, MatDatepickerModule, MatAutocompleteModule, MatSliderModule, 
        MatChipsModule, MatExpansionModule, MatNativeDateModule, MatSlideToggleModule, MatProgressSpinnerModule
		    } from '@angular/material'; 
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {AngularFireModule } from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import 'hammerjs';
import {MasonryModule} from 'angular2-masonry';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NamePipe} from './name.pipe';
import { AgmCoreModule } from '@agm/core';
import {AuthMethods, AuthProvider, AuthProviderWithCustomConfig, FirebaseUIAuthConfig, FirebaseUIModule, CredentialHelper} from 'firebaseui-angular';//Constants
import {_apartment_types} from '../environments/environment'
import {_nearbys} from '../environments/environment'
import {_locations} from '../environments/environment'
import {firebaseConfig, facebookCustomConfig, firebaseUiAuthConfig} from '../environments/environment'
//Custom components
import { AppComponent } from './app.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { ApartlistComponent } from './apartlist/apartlist.component';
import { ChatComponent } from './chat/chat.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { PropertyComponent } from './property/property.component';
import { PropertylistComponent } from './propertylist/propertylist.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { HostDashComponent } from './host-dash/host-dash.component';
import { PropUploadComponent } from './prop-upload/prop-upload.component';
import { ApartUploadComponent } from './apart-upload/apart-upload.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {UserService} from './user.service';
import { UserComponent } from './user/user.component';
import {AccommService} from './accomm.service';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationComponent } from './notification/notification.component';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { HostBookingsComponent } from './host-bookings/host-bookings.component';
import { SearchFeedComponent } from './search-feed/search-feed.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { GeneralResultsComponent } from './general-results/general-results.component';
import {ShareComponent} from './share/share.component';
import {ChatService} from './chat.service';
import {SearchfeedService} from './searchfeed.service';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { EditApartmentComponent } from './edit-apartment/edit-apartment.component';
import { PropertyApartmentsComponent } from './property-apartments/property-apartments.component';
import {SearchR} from './apartlist/apartlist.component'
import {ResponseComponent} from './search-feed/search-feed.component';
import {ReportComponent} from './prop-upload/prop-upload.component';
import { StatusComponent } from './status/status.component';
import { LoadingComponent } from './loading/loading.component';
import { BookingComponent } from './booking/booking.component';
import {EnquireComponent} from './apartment/apartment.component';
import {LandingGuard} from './landing.guard';
import {HomeGuard} from './home.guard';
import {AuthGuard} from './auth.guard';
import { GreetingComponent } from './greeting/greeting.component';
import {ResetPassword} from './signin/signin.component';
import { AboutComponent } from './about/about.component';
import { InvestorsComponent } from './investors/investors.component';
import { HelpComponent } from './help/help.component';
// Route configuration TODO, modularize
const routes = [
  {path: 'landing', component: LandingComponent},
  {path: 'about', component: AboutComponent},
  {path: 'investors', component: InvestorsComponent},
  {path: 'help', component: HelpComponent},
  {path: 'greetings', component: GreetingComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'home', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: HomeComponent,
      children: [
        {path: 'chat_list', component: ChatlistComponent},
        {path: 'support', component: ChatComponent},
        {path: 'apart_list', component: ApartlistComponent},
        {path: 'apartment/:apart_id', component: ApartmentComponent},
        {path: 'noti_list', component: NotificationListComponent},
        {path: 'user/:uid', component: UserComponent}
      ]
},
  {path: 'host_dash', canActivate: [AuthGuard], canActivateChild: [AuthGuard] , component: HostDashComponent,
    children:[
      //if we are on mobile view make search_feed the default route 
      {path: 'prop_upload', component: PropUploadComponent},
      {path: 'chat_list', component: ChatlistComponent},
      {path: 'support', component: ChatComponent},
      {path: 'apart_upload/:prop_id', component: ApartUploadComponent},
      {path: 'property/:prop_id', component: PropertyComponent},
      {path: 'editProperty/:prop_id', component: EditPropertyComponent},
      {path: 'propertyApartments/:prop_id', component: PropertyApartmentsComponent},
      {path: 'editApartment/:apart_id', component: EditApartmentComponent},
      {path: 'apartment/:prop_id', component: ApartmentComponent},
      {path: 'property_list', component: PropertylistComponent},
      {path: 'bookings', component: HostBookingsComponent},
      {path: 'booking/:booking_id', component: BookingComponent},
      {path: 'search_feed', component: SearchFeedComponent},
      {path: 'user/:uid', component: UserComponent}
      ]
  },
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: '**', component: LandingComponent}
]

@NgModule({
  declarations: [
    AppComponent,ApartmentComponent,ApartlistComponent,ChatComponent,ChatlistComponent,PropertyComponent,
    PropertylistComponent,SigninComponent,SignupComponent,LandingComponent,HostDashComponent,PropUploadComponent,
    ApartUploadComponent,HomeComponent,HeaderComponent,FooterComponent,UserComponent,
    NotificationListComponent,NotificationComponent,UserBookingComponent,HostBookingsComponent,SearchFeedComponent,
    SearchResultsComponent,GeneralResultsComponent,ShareComponent,NamePipe,EditPropertyComponent,EditApartmentComponent,
    PropertyApartmentsComponent,SearchR,ResponseComponent,ReportComponent,StatusComponent,LoadingComponent,
    BookingComponent, EnquireComponent, GreetingComponent, ResetPassword, AboutComponent, InvestorsComponent, HelpComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes),
    NgbModule.forRoot(), HttpClientModule,BrowserAnimationsModule,MatCardModule,MatButtonModule,
    MatIconModule,MatDialogModule,MatCheckboxModule,MatInputModule,MatMenuModule,MatTabsModule,
    MatGridListModule,MatListModule,MatToolbarModule,MatSelectModule,MatSidenavModule,MatDatepickerModule,
    MatAutocompleteModule, MatSliderModule,ShareButtonsModule.forRoot(),AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,AngularFireAuthModule,MasonryModule,FlexLayoutModule,MatChipsModule,MatExpansionModule,
    MatNativeDateModule,MatSlideToggleModule,MatProgressSpinnerModule,FirebaseUIModule.forRoot(firebaseUiAuthConfig),
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDDlerLZUic8oouF8ndwSPIK0wPigTwtf0',
      libraries: ['places']
    })],
  entryComponents: [
    ShareComponent, SearchR, UserBookingComponent, ResponseComponent, ReportComponent, 
    StatusComponent, EnquireComponent, ResetPassword
  ],
  providers: [UserService, AccommService, ChatService, SearchfeedService, AuthGuard, HomeGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
