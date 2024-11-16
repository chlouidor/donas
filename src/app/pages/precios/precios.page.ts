import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.page.html',
  styleUrls: ['./precios.page.scss'],
})
export class PreciosPage implements OnInit {
  categories: string[] = ['animal', 'career', 'celebrity', 'dev', 'explicit', 'fashion', 'food', 'history', 'money', 'movie', 'music', 'political', 'religion', 'science', 'sport', 'travel'];
  selectedCategory: string = '';  
  joke: string = '';  

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  getJoke() {
    if (this.selectedCategory) {
      this.http.get<any>(`https://api.chucknorris.io/jokes/random?category=${this.selectedCategory}`)
        .subscribe((response) => {
          this.joke = response.value;  // Asigna el chiste a la variable
          console.log('Chiste:', this.joke);  // Muestra el chiste en la consola
        }, (error) => {
          console.error('Error fetching joke:', error);
        });
    }
  }
}
