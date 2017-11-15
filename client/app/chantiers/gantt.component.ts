import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GanttService} from "../_services/gantt.service";
import {Tache} from "../_models/gantt/tache";
import {Lien} from "../_models/gantt/link";

@Component({
    selector: "gantt",
    styles: [`:host{display: block;height: 600px;position: relative;width: 100%;}`],
    template: "<div #gantt_here style='width: 100%; height: 100%;'></div>",
    providers: [GanttService]
})
export class GanttComponent implements OnInit {
    @Input()
    id_chantier: number;
    tasks: Tache[] = [];
    links: Lien[] = [];

    @ViewChild("gantt_here") ganttContainer: ElementRef;

    constructor(private ganttService: GanttService) {
    }


    ngOnInit() {
        this.tasks = [];
        this.links = [];
        gantt.config.xml_date = "%Y-%m-%d %H:%i";
        gantt.init(this.ganttContainer.nativeElement);
        gantt.clearAll();

        // TASKS EVENTS

        gantt.attachEvent("onAfterTaskAdd", (id, item) => {
            this.ganttService.addTask(this.serializeTask(item, true)).subscribe((newId) => {
                if (newId != id) {
                    gantt.changeTaskId(id, newId);
                }
            });
        });

        gantt.attachEvent("onAfterTaskDelete", (id) => {
            this.ganttService.removeTask(id).subscribe((response) => {
                if (response.status != 200) {
                    console.log("ERROR: Failed removing task " + id);
                    console.log(response);
                }
            })
        });

        gantt.attachEvent("onAfterTaskUpdate", (id, item) => {
            this.ganttService.updateTask(this.serializeTask(item)).subscribe((response) => {
                if (response.status != 200) {
                    console.log("ERROR: Failed updating task " + id);
                    console.log(response);
                    return;
                }
            })
        });

        // LINKS EVENTS

        gantt.attachEvent("onAfterLinkAdd", (id, item) => {
            this.ganttService.addLink(this.serializeLink(item, true)).subscribe((newId) => {
                if (newId != id) {
                    gantt.changeLinkId(id, newId);
                }
            });
        });

        gantt.attachEvent("onAfterLinkUpdate", (id, item) => {
            this.ganttService.updateLink(this.serializeLink(item)).subscribe((response) => {
                if (response.status != 200) {
                    console.log("ERROR: Failed updating link " + id);
                    console.log(response);
                    return;
                }
            })
        });

        gantt.attachEvent("onAfterLinkDelete", (id) => {
            this.ganttService.removeLink(id).subscribe((response) => {
                if (response.status != 200) {
                    console.log("ERROR: Failed removing link " + id);
                    console.log(response);
                    return;
                }
            })
        });

        this.ganttService.getTasksByIdChantier(this.id_chantier).subscribe(tasks => {
            this.tasks = tasks;

            for (let task of this.tasks) {
                this.ganttService.getLinksByIdTache(task.id).subscribe(links => {
                    links.map((newLink) => {
                        let isNew = true;
                        for (let link of this.links) {
                            if (link.id == newLink.id) {
                                isNew = false;
                                break;
                            }
                        }
                        if (isNew) this.links.push(newLink);
                    });

                    let data = {data: this.tasks, links: this.links};
                    gantt.parse(data);
                })
            }
        });
    }

    private serializeTask(data: any, insert: boolean = false): Tache {
        let task = this.serializeItem(data, insert) as Tache;

        task.id_chantier = this.id_chantier;

        return task;
    }

    private serializeLink(data: any, insert: boolean = false): Lien {
        return this.serializeItem(data, insert) as Lien;
    }

    private serializeItem(data: any, insert: boolean): any {
        let result = {};

        for (let i in data) {
            if (i.charAt(0) == "$" || i.charAt(0) == "_") continue;
            if (insert && i == "id") continue;
            if (data[i] instanceof Date) {
                result[i] = gantt.templates.xml_format(data[i]);
            }
            else {
                result[i] = data[i];
            }
        }

        return result;
    }
}