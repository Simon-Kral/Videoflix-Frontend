import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-pre-login',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './pre-login.component.html',
  styleUrl: './pre-login.component.scss'
})
export class PreLoginComponent {

}
