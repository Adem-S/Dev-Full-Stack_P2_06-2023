import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { HeaderDetails } from "src/app/core/models/HeaderDetails";
import { Olympic } from "src/app/core/models/Olympic";
import { OlymicMedals } from "src/app/core/models/OlymicMedals";
import { OlympicService } from "src/app/core/services/olympic.service";
import { OlympicPieChart } from "src/app/core/models/OlympicPieChart";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  olympics$!: Observable<Olympic[]>;
  loading$!: Observable<boolean>;
  headerDetails!: HeaderDetails[];
  medalList!: OlympicPieChart[];

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.loading$ = this.olympicService.loading$;
    this.olympics$ = this.olympicService.olympics$.pipe(
      tap((olympics) => {
        if (olympics.length > 0) {
          this.setHeaderDetails(olympics);
          this.setMedalsForPieChart(
            this.olympicService.getMedalsCount(olympics)
          );
        }
      })
    );
  }

  setHeaderDetails(olympic: Olympic[]) {
    this.headerDetails = [
      { key: "Number of JOS", value: olympic[0].participations.length },
      { key: "Number of countries", value: olympic.length },
    ];
  }

  setMedalsForPieChart(medals: OlymicMedals[]) {
    this.medalList = medals.map((medal) => {
      return { name: medal.name, value: medal.value, extra: { id: medal.id } };
    });
  }

  onSelectCountry(olympic: OlympicPieChart): void {
    this.router.navigateByUrl(`country/${olympic.extra.id}`);
  }
}
