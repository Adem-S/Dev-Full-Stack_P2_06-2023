import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, map, tap } from "rxjs/operators";
import { Olympic } from "../models/Olympic";
import { OlymicMedals } from "../models/OlymicMedals";

@Injectable({
  providedIn: "root",
})
export class OlympicService {
  private olympicUrl = "./assets/mock/olympic.json";
  private _olympics$ = new BehaviorSubject<Olympic[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    this._loading$.next(true);
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this._olympics$.next(value);
        this._loading$.next(false);
      }),
      catchError(() => {
        this._olympics$.next([]);
        this._loading$.next(false);
        return throwError(() => new Error("Failed to load data from server"));
      })
    );
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get olympics$(): Observable<Olympic[]> {
    return this._olympics$.asObservable();
  }

  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      filter((olympics: Olympic[]) => olympics.length > 0),
      filter((olympics: Olympic[]) =>
        olympics.some((olympic: Olympic) => olympic.id === id)
      ),
      map((olympics: Olympic[]) =>
        olympics.find((olympic: Olympic) => olympic.id === id)
      )
    );
  }

  getMedalsCount(olympics: Olympic[]): OlymicMedals[] {
    return olympics.map((olympic) => {
      return {
        id: olympic.id,
        name: olympic.country,
        value: olympic.participations.reduce(
          (acc, participation) => acc + participation.medalsCount,
          0
        ),
      };
    });
  }

  getAthletesCount(olympics: Olympic[]): OlymicMedals[] {
    return olympics.map((olympic) => {
      return {
        id: olympic.id,
        name: olympic.country,
        value: olympic.participations.reduce(
          (acc, participation) => acc + participation.athleteCount,
          0
        ),
      };
    });
  }
}
