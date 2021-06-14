import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthentificationService} from '../../services/security/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = this.formBuilder.group({
    pseudo: ['', Validators.required],
    'mot-de-passe': ['', Validators.required]
  });

  public loading = false;
  public submitted = false;
  public returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthentificationService
  ) { }


  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit(): void {

    if (this.loginForm) {

      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }

      this.loading = true;
      this.authenticationService.login(
        this.loginForm.controls.pseudo.value,
        this.loginForm.controls['mot-de-passe'].value)
        .subscribe(
          message => {
            console.log(this.returnUrl);
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.loading = false;
          }
        );
    }
  }
}
