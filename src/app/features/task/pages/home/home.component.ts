// Angular
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

// Third party
import { AgCharts } from 'ag-charts-angular';
import {
  AgBarSeriesOptions,
  AgCartesianSeriesOptions,
  AgChartLegendOptions,
  AgChartOptions
} from 'ag-charts-community';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import * as _ from 'lodash';

// Local
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TTask } from '../../../../utils/models/task.model';
import { ListService } from '../../../../utils/services/list.service';
import { IState } from '../../../../data-access/state/state.model';


const MOMENT = _rollupMoment || _moment;
type TChartItem = {
  date: string;
  count: number;
  [key: string]: string | number;
};


@Component({
  selector: 'feature-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    AgCharts
  ]
})
export class HomeComponent {
  // - di
  private readonly _STORE: WritableSignal<IState> = inject(STORE_TOKEN);

  // - custom di
  protected readonly _LIST_SERVICE: ListService = inject(ListService);

  // - reactivity
  private readonly TASKS: Signal<TTask[]> = this._STORE().task.list;
  private readonly GET_TASKS: Signal<TTask[]> = this._STORE().task.getList;

  private readonly HIGH_PRIORITY_LIST: Signal<TTask[]> = computed(() =>
    this._LIST_SERVICE.filter(this.GET_TASKS(), 'high-priority')
  );
  private readonly TODO_LIST: Signal<TTask[]> = computed(() =>
    this._LIST_SERVICE.filter(this.GET_TASKS(), 'todo')
  );
  private readonly COMPLETED_LIST: Signal<TTask[]> = computed(() =>
    this._LIST_SERVICE.filter(this.GET_TASKS(), 'done')
  );
  private readonly IN_PROGRESS_LIST: Signal<TTask[]> = computed(() =>
    this._LIST_SERVICE.filter(this.GET_TASKS(), 'in-progress')
  );
  private readonly ALL_LIST: Signal<TTask[]> = computed(() =>
    this._LIST_SERVICE.filter(this.TASKS(), 'none')
  );

  readonly TOTAL_HIGH_PRIORITY: Signal<number> = this._STORE().task.count.highPriorityListComputed;
  readonly TOTAL_TODO: Signal<number> =  this._STORE().task.count.todoListComputed;
  readonly TOTAL_COMPLETED: Signal<number> = this._STORE().task.count.completeListComputed;
  readonly TOTAL_IN_PROGRESS: Signal<number> = this._STORE().task.count.inProgressListComputed;
  readonly TOTAL_ALL_LIST: Signal<number> = this._STORE().task.count.allListComputed;

  // - chart
  private readonly CHART_DATA_LIST_BY_MONTH: Signal<TChartItem[]> = computed(() => (
     [
      ...[this.filterDataByMonth(
         this.HIGH_PRIORITY_LIST()).map(item => ({ ...item, high: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByMonth(
        this.TODO_LIST()).map(item => ({ ...item, todo: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByMonth(
        this.IN_PROGRESS_LIST()).map(item => ({ ...item, inprogress: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByMonth(
        this.COMPLETED_LIST()).map(item => ({ ...item, completed: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByMonth(
        this.ALL_LIST()).map(item => ({ ...item, all: item.count })
      )] as unknown as TChartItem[],
    ]
  ));
  private readonly CHART_DATA_LIST_BY_WEEK_DAY: Signal<TChartItem[]> = computed(() => (
     [
      ...[this.filterDataByWeekday(
        this.HIGH_PRIORITY_LIST()).map(item => ({ ...item, high: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByWeekday(
        this.TODO_LIST()).map(item => ({ ...item, todo: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByWeekday(
        this.IN_PROGRESS_LIST()).map(item => ({ ...item, inprogress: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByWeekday(
        this.COMPLETED_LIST()).map(item => ({ ...item, completed: item.count })
      )] as unknown as TChartItem[],
      ...[this.filterDataByWeekday(
        this.ALL_LIST()).map(item => ({ ...item, all: item.count })
      )] as unknown as TChartItem[],
    ]
  ));

  // - no reactivity
  private readonly BAR_OPTIONS: AgBarSeriesOptions = {
    type: "bar",
    xKey: "date",
    yKey: "count",
    yName: "Task",
    grouped: true,
  };
  private readonly BAR_AND_LINE: (arg?: boolean) => AgCartesianSeriesOptions[] = ((isDay = false) => ([
    { ...this.BAR_OPTIONS, yKey: "high", yName: "High" },
    { ...this.BAR_OPTIONS, yKey: "todo", yName: "Todo" },
    { ...this.BAR_OPTIONS, yKey: "inprogress", yName: "In Progress" },
    { ...this.BAR_OPTIONS, yKey: 'completed', yName: "Completed" },
    {
      ...this.BAR_OPTIONS, yKey: 'all',
      yName: `# of Tasks of the ${isDay ? 'Day' : 'Month'}`,
      type: "line"
    },
  ]));


  chartOptionsByMonth: AgChartOptions = {
    data:   [],
    series: this.BAR_AND_LINE(),
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Month" }
      },
      {
        type: "number",
        position: "left",
        title: { text: "Count" }
      }
    ]
  };
  chartOptionsByWeekDay: AgChartOptions = {
    data:   [],
    series: this.BAR_AND_LINE(true),
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Day" }
      },
      {
        type: "number",
        position: "left",
        title: { text: "Count" }
      }
    ]
  };
  donutGraphOptions: AgChartOptions = {
    data: [],
  };
  barGraphOptions: AgChartOptions = {
    data: [],
    series: [
      {
        type: "bar",
        xKey: "type",
        yKey: "todo",
        yName: "Todo",
      },
      {
        type: "bar",
        xKey: "type",
        yKey: "inprogress",
        yName: "In Progress",
      },
      {
        type: "bar",
        xKey: "type",
        yKey: "done",
        yName: "Completed",
      },
    ],
    legend: {
      enabled: true,
      item: {
        label: {
          enabled: false,
        }
      }
    } as AgChartLegendOptions
  };


  constructor() {
    effect(() => {
      this.setChartOptionsByMonth();
      this.setChartOptionsByWeekDay();
      this.setDonutChartOptions();
      this.setBarChartOptions();
    });
  }

  setChartOptionsByMonth(): void {
    const LIST = _.flatten(this.CHART_DATA_LIST_BY_MONTH() as TChartItem[]);

    const MONTH_ORDER = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    // Group raw data by month (in case of duplicates)
    const GROUPED_BY_MONTH = LIST.reduce((acc: Record<string, TChartItem>, curr: TChartItem) => {
      const EXISTING = acc[curr.date];

      if (EXISTING) {
        // Merge counts (optional if needed)
        EXISTING.count += curr.count || 0;
        Object.assign(EXISTING, curr); // Merge other properties
      }
      else {
        acc[curr.date] = { ...curr };
      }
      return acc;
    }, {} as Record<string, TChartItem>) || [];

    // Ensure all months exist, set default
    const ALL_MONTHS = MONTH_ORDER.map((month) => (
      GROUPED_BY_MONTH[month] ?? {
        date: month,
        count: 0,
        all: 0,
        high: 0,
        todo: 0,
        inprogress: 0,
        completed: 0
      }
    ));

    // Merge by month
    const MERGED_DATA = ALL_MONTHS.reduce((acc: TChartItem[], curr: TChartItem) => {
      const EXISTING = acc.find((item: TChartItem) => item.date === curr.date);

      if (EXISTING) {
        Object.assign(EXISTING, curr, {
          ...EXISTING,
          ...curr,
          count: (EXISTING.count || 0) + (curr.count || 0),
        });
      }
      else acc.push({ ...curr });

      return acc;
    }, [] as typeof LIST) || [];

    // Sort by month order
    const SORTED_DATA = MERGED_DATA.sort((a, b) =>
      MONTH_ORDER.indexOf(a.date) - MONTH_ORDER.indexOf(b.date)
    );

    this.chartOptionsByMonth = {
      ...this.chartOptionsByMonth,
      data: SORTED_DATA
    };
  }

  setChartOptionsByWeekDay(): void {
    const WEEKDAY_ORDER = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
    ];

    // Flatten and merge your data first
    const MERGE_DATA_WEEK = _.flatten(this.CHART_DATA_LIST_BY_WEEK_DAY())
      .reduce((acc: TChartItem[], curr: TChartItem) => {
        const EXISTING = acc.find((item: any) => item.date === curr.date);

        if (EXISTING) Object.assign(EXISTING, curr); // Merge keys (e.g. high, todo)
        else acc.push({ ...curr, date: curr.date });

        return acc;
      }, []);

    // Create a map for easy lookup
    const DATA_MAP = new Map<string, any>();
    for (const item of MERGE_DATA_WEEK) {
      DATA_MAP.set(item.date, item);
    }

    // Ensure all days exist
    const COMPLETE_DAY_WEEK = WEEKDAY_ORDER.map((day) => (
      DATA_MAP.get(day) ?? {
        date: day,
        count: 0,
        all: 0,
        high: 0,
        todo: 0,
        inprogress: 0,
        completed: 0,
      }
    ));

    const SORTED = COMPLETE_DAY_WEEK.sort((a, b) =>
      WEEKDAY_ORDER.indexOf(a.date) - WEEKDAY_ORDER.indexOf(b.date)
    );

    this.chartOptionsByWeekDay = {
      ...this.chartOptionsByWeekDay,
      data: SORTED
    };
  }

  setDonutChartOptions(): void {
    const DATA_SUMMARY = [
      {
       total: this.TOTAL_TODO(),
       type: 'Todo'
     },
     {
       total: this.TOTAL_IN_PROGRESS(),
       type: 'In Progress'
     },
     {
       total: this.TOTAL_COMPLETED(),
       type: 'Completed'
     },
   ];

    this.donutGraphOptions = {
      ...this.donutGraphOptions,
      data: DATA_SUMMARY,
      series: [
        {
          type: "donut",
          calloutLabelKey: "type",
          angleKey: "total",
          innerRadiusRatio: 20,
          innerLabels: [
            {
              text: "Total Tasks",
              fontWeight: "bold",
            },
            {
              text: String(this.GET_TASKS().length),
              spacing: 4,
              fontSize: 48,
              color: "green",
            },
          ],
          innerCircle: {
            fill: "#c9fdc9",
          },
        },
      ],
    } as AgChartOptions;
  }

  setBarChartOptions(): void {
    const DATA_SUMMARY_BAR = [
      {
        total: this.TOTAL_TODO(),
        todo: this.TOTAL_TODO(),
        type: 'Todo'
      },
      {
        total: this.TOTAL_IN_PROGRESS(),
        inprogress: this.TOTAL_IN_PROGRESS(),
        type: 'In Progress'
      },
      {
        total: this.TOTAL_COMPLETED(),
        done: this.TOTAL_COMPLETED(),
        type: 'Completed'
      },
    ];

    this.barGraphOptions = {
      ...this.barGraphOptions,
      data: DATA_SUMMARY_BAR
    };
  }


  filterDataByMonth(tasks: TTask[]): TChartItem[] {
    const LIST =  tasks
      .filter(task => MOMENT(task.dueDate).year() === 2025) // filter only this year
      .reduce((acc, task) => {
        const MONTH = MOMENT(task.dueDate).format('MMMM'); // get month
        acc[MONTH] = (acc[MONTH] || 0) + 1; // count month
        return acc;
      }, {} as Record<string, number>);

    // return only date and count
    return Object.entries(LIST).map(([date, count]) => ({
      date,
      count
    }));
  }

  filterDataByWeekday(tasks: TTask[]): TChartItem[] {
    const START_OF_WEEK = MOMENT().startOf('week'); // Sunday by default
    const END_OF_WEEK = MOMENT().endOf('week');

    const FILTERED = tasks.filter(task => {
      const DUE = MOMENT(task.dueDate);
      return DUE.isBetween(START_OF_WEEK, END_OF_WEEK, undefined, '[]'); // inclusive
    });

    const LIST = FILTERED.reduce((acc, task) => {
      const day = MOMENT(task.dueDate).format('dddd'); // e.g., "Monday"
      acc[day] = (acc[day] || 0) + 1; // count the Day
      return acc;
    }, {} as Record<string, number>);

    // return only date and count
    return Object.entries(LIST).map(([date, count]) => ({
      date,
      count
    }));
  }

}
