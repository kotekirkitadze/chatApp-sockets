import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public roomId: string;
  public messageText: string;
  public messageArray: { user: string, message: string }[] = [];

  private storageArray = [];

  public showScreen: boolean;

  @ViewChild('popup', { static: false }) popup: any;

  ngAfterViewInit() {
    this.openPopup(this.popup)

  }

  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  login(dismiss: any): void {
    this.currentUser = this.userList?.find(user => user.phone === this.phone?.toString().toLowerCase());
    this.userList = this.userList.filter((user) => user.phone !== this.phone?.toString().toLowerCase());


    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }
    console.log(this.currentUser)
  }

  public phone: string;
  public currentUser;
  public selectedUser;

  public userList = [
    {
      id: 1,
      name: "Bill",
      phone: '11',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: "Bob",
      phone: '22',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: "Ben",
      phone: '33',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    },
    {
      id: 4,
      name: "Bernand",
      phone: '44',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6'
      }
    }
  ];

  constructor(private chatService: ChatService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.chatService.getMessage()
      .subscribe((data: { user: string; message: string }) => {
        // this.messageArray.push(data)
        setTimeout(() => {
          if (this.roomId) {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray?.findIndex(storage => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }
        }, 5000)
      })
  }

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList?.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray?.findIndex(storage => storage.roomId === this.roomId)

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId })
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex(storage => storage.roomId == this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };
      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);

    console.log(this.messageArray)
    this.messageText = '';
  }

}
