import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-post-login',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.scss'
})
export class PostLoginComponent {

}
