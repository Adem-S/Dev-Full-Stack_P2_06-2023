import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, tap } from "rxjs";
import { HeaderDetails } from "src/app/core/models/HeaderDetails";
import { Olympic } from "src/app/core/models/Olympic";
import { OlympicLineChart } from "src/app/core/models/OlympicLineChart";
import { Participation } from "src/app/core/models/Participation";
import { OlympicService } from "src/app/core/services/olympic.service";

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.scss"],
})
export class CountryComponent implements OnInit {
  olympic$!: Observable<Olympic | undefined>;
  loading$!: Observable<boolean>;
  headerDetails!: HeaderDetails[];
  medalsByOlympic!: OlympicLineChart[];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading$ = this.olympicService.loading$;
    const countryId = +this.route.snapshot.params["id"];
    this.olympic$ = this.olympicService.getOlympicById(countryId).pipe(
      tap((olympic) => {
        this.setHeaderDetails(olympic);
        this.setMedalsByOlympic(olympic);
      })
    );
  }

  setHeaderDetails(olympic: Olympic | undefined) {
    if (olympic) {
      let medals = this.olympicService.getMedalsCount([olympic])?.[0];
      let athletes = this.olympicService.getAthletesCount([olympic])?.[0];
      this.headerDetails = [
        {
          key: "Number of entries",
          value: olympic.participations.length,
        },
        {
          key: "Total number medals",
          value: medals.value,
        },
        { key: "Total number of athletes", value: athletes.value },
      ];
    }
  }

  setMedalsByOlympic(olympic: Olympic | undefined) {
    if (olympic) {
      this.medalsByOlympic = [
        {
          name: olympic.country,
          series: olympic.participations.map((participation: Participation) => {
            return {
              name: participation.year.toString(),
              value: participation.medalsCount,
            };
          }),
        },
      ];
    }
  }

  formatValue(val: number) {
    return val % 1 === 0 ? val : 0;
  }
}
