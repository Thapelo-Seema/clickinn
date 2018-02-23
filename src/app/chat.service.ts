import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from './user.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService implements OnDestroy {

	user: firebase.User;
	messaging = firebase.messaging();
	currentMessage = new BehaviorSubject(null);
	chatMessages: FirebaseListObservable<any>;
	chatMessage : any;
	
	
  	constructor(public db: AngularFireDatabase, private afAuth: AngularFireAuth, private user_svc: UserService, private http: HttpClient) {
		this.afAuth.authState.subscribe(user =>{
			if(user !== undefined && user !== null){
				this.user = user;
			}
		})
	 }

	 ngOnDestroy(){
	 }

	getTimeStamp(){
    const rightNow: number = Date.now();
    return rightNow;
   }
	
	getMessages(thread_id: string): FirebaseListObservable<any>{
		return this.db.list(`threads/${thread_id}`)
	} 

	getContacts(): Promise<string[]>{
		var contacts = new Promise<string[]>((resolve, reject) =>{

			this.db.list(`users/${this.user_svc.getLoggedUser().uid}/threads`).subscribe(threads =>{
				var peeps = []
				threads.forEach(thread =>{
					peeps.push(thread.$key)
				})
				resolve(peeps);
			})
		} )
		//console.log('Getting contacts for the uid: ', this.user_svc.getLoggedUser().uid)
		return contacts;
	}

	getSupport(): FirebaseObjectObservable<any>{
		return this.db.object(`users/${this.user_svc.getLoggedUser().uid}/threads/wsJmxmZtBjMdD1WwOZb3MOIIWSP2`);
	}

	getThreadID(contact_id: string): Promise<string>{
		var threadID = new Promise<string>((resolve, reject)=>{
			this.db.object(`users/${this.user.uid}/threads/${contact_id}/thread_id`).take(1).subscribe(thread =>{
				//console.log('Thread: ', thread)
				resolve(thread.$value)
			})
		})
		return threadID;
	}

	getContactObj(uid: string ){
		return this.db.object(`users/${uid}`)
	}

	getChats(){
		return this.db.list(`users/${this.user_svc.getLoggedUser().uid}/threads`);
	}

	sendEmail(emailAddress, content){
		let url = `https://us-central1-clickinn-996f0.cloudfunctions.net/httpEmail`;
		let params: HttpParams = new HttpParams();
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})

		params.set('to', emailAddress);
		params.set('from', '200912541@student.uj.ac.za');
		params.set('content', content);

		return this.http.post(url, params, {headers: headers, params: params}).toPromise().then(res =>{
			console.log(res)
		}).catch(err =>{
			console.log(err);
		})
	}

	sendMessage(msg: string, reciever_id: string, topic:string){
		//if this user has this reciever_id in their thread list, the thread_id is retrieved and this message 
		//is add to the already existing thread, otherwise a new thread is started
		const timeStamp = this.getTimeStamp();
		const sender = {
			name: this.user_svc.getLoggedUser().displayName,
			id: this.user_svc.getLoggedUser().uid
		};
		//let thread_obj = this.db.object(`/users/${this.user.uid}/threads`);
		var threads = this.db.list('threads');
		var sender_thread = this.db.object(`/users/${this.user_svc.getLoggedUser().uid}/threads/${reciever_id}`);
		var reciever_thread = this.db.object(`/users/${reciever_id}/threads/${this.user.uid}`);
		
		sender_thread.take(1).subscribe(dat =>
			{
				//console.log(dat);
				if(dat.thread_id != null ){
					const sendToThread =  this.db.list(`threads/${dat.thread_id}`);
					return sendToThread.push({
					   message: msg,
					   timeStamp: timeStamp,
					   by: sender,
					   to: reciever_id,
					   topic: topic,
					   delivered: false,
					   read: false
				   }).then(val =>{
				   			//this.sendEmail('thapelo.seema@gmail.com', msg);
							if(val.key){
								this.db.object(`threads/${dat.thread_id}/${val.key}/delivered`).set(true);
							}
						})
				}else{
					return threads.push({})
					.then(dat => {
						const tpath = this.db.list(`threads/${dat.key}`);
						sender_thread.set({thread_id: dat.key});
						reciever_thread.set({thread_id: dat.key});
						return tpath.push({
							message: msg,
							timeStamp: timeStamp,
							by: sender,
							to: reciever_id,
							topic: topic,
							delivered: false,
							read: false
						}).then(val =>{
							//this.sendEmail('thapelo.seema@gmail.com', msg);
							if(val.key){
								this.db.object(`threads/${dat.key}/${val.key}/delivered`).set(true);
							}
						})
						
					})
				}
			}
		);
	}

	setMessageToSeen(thread_id: string, msg_id: string){
		this.db.object(`threads/${thread_id}/${msg_id}/read`).set(true);
	}

	getUnseenMessages(thread_id: string){
		return this.db.list(`threads/${thread_id}`,{
			query: {
				orderByChild: 'read',
				equalTo: false
			}
		}).take(1)
	}

}
