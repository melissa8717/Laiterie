import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FileItem, FileUploader} from "ng2-file-upload";
import {AlertService, UtilsService} from "../_services/index";


@Component({
    moduleId: module.id,
    selector: 'img-uploader',
    templateUrl: 'imguploader.component.html'
})

export class ImguploaderComponent implements OnInit {

    @Input() name: string;
    @Input() id: number;
    @Input() onlineImgUrl: string;

    @Input() uploaderImg: FileUploader;
    @Output() uploaderImgChange = new EventEmitter();

    private uploadUrl: string;
    private localImgUrl: string;

    constructor(public utilsService: UtilsService, private alertService: AlertService) {
    }

    ngOnInit() {
        this.uploadUrl = 'http://' + location.hostname + ':4000/image/' + this.name;

        this.uploaderImg = new FileUploader({url: this.uploadUrl + "/" + this.id});

        this.uploaderImg.onAfterAddingFile = (file: any) => {
            file.withCredentials = false;
            this.uploaderImgChange.emit(this.uploaderImg);
        };

        this.uploaderImg.onSuccessItem = (item: FileItem) => {
            this.alertService.success("Image modifiée");
            item.remove();
        }
    }

    private readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.localImgUrl = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
}