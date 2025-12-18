import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../header/header";
import { AuthService } from "../../service/auth/auth";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vetandgo_amd');
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
}
