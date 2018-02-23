import { AuthMethods, AuthProvider, FirebaseUIAuthConfig, FirebaseUIModule, AuthProviderWithCustomConfig, CredentialHelper } from 'firebaseui-angular';

export const environment = {
  production: false
};

export const _apartment_types = 
["2 Bedroom flat","1 Bedroom flat", "Bachelor flat", "Cottage","Single Room", "2 Sharing Room", "3 Sharing Room"];
//Autocomplete constants TODO hookup google places
export const _nearbys = [
              'University of Johannesburg (main campus)', 
             'University of Johannesburg (Bunting Rd campus)','Campus Square Mall - Melville',
             'KFC - Melville','MacDonalds - Melville','SABC - Auckland Park', 'Media Park',
             'Laborie','Brixton Mall','Brixton Police Station','Brixton Library',
             'Hunters Sports Bar','Melville Koppies','Stones','South Point',
             'Kingsway Place','Rosebank College','Wits University (Main Campus)',
             'Wits University (Education Campus)','Wits University (Business Campus)','Braamfontein Center']

export const  _locations = [
             'Melville', 'Brixton', 'Auckland Park','Westdene','Fietas',
             'Hursthill','Rosmoore','Cresta','Sophiatown','Langlaagte',
             'Crosby','Westbury','Nuclare','Braamfontein','Johannesburg CBD',
             'Newtown','Marshalltown','Hillbrow','Parktown','Doorfontein',
             'Bruma','Yeoville','Berea'];

             export const firebaseConfig = {
    apiKey: "AIzaSyDT6HDi-pzKJDKGIUmBqz75ti-SMVzt0tY",
    authDomain: "clickinn-996f0.firebaseapp.com",
    databaseURL: "https://clickinn-996f0.firebaseio.com",
    projectId: "clickinn-996f0",
    storageBucket: "clickinn-996f0.appspot.com",
    messagingSenderId: "882290923419"
}

export const facebookCustomConfig: AuthProviderWithCustomConfig = {
  provider: AuthProvider.Facebook,
  customConfig: {
    scopes: [
      'public_profile',
      'email',
      'user_likes',
      'user_friends'
    ],
    customParameters: {
      // Forces password re-entry.
      auth_type: 'reauthenticate'
    }
  }
};

export const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    facebookCustomConfig,
    AuthProvider.Password
  ],
  method: AuthMethods.Popup,
  tos: '',
  credentialHelper: CredentialHelper.AccountChooser
};

