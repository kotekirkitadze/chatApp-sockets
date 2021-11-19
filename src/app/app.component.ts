import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public roomId: string;
  public messageText: string;
  public messageArray: { user: string, message: string }[] = [];

  ngOnInit() { }
}
