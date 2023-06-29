import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreprocessingService } from 'src/app/services/preprocessing.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent {
  
    constructor(private router: Router, private preprocessing:PreprocessingService) { 
      this.preprocessing.dataIsLoaded.subscribe((loaded: boolean) => {
        if (loaded)
          this.router.navigate(['/tab1']);
      });
    }
    ngOnInit(): void {

    }
}
