/* **************************************************************************
  SigCaptX-Globals.ts

  This file contains enumerators, function objects and global variables common to various functions

  Copyright (c) 2021 Wacom Co. Ltd. All rights reserved.

  v1.0

***************************************************************************/

/* Define global variables */
export var wgssSignatureSDK = null;  // Signature SDK object
export var sigsdkptr = null;
export var timeout;

export const BITMAP_BACKGROUNDCOLOR = 0x00FFFFFF;
export const BITMAP_IMAGEFORMAT = "bmp";
export const BITMAP_INKCOLOR = 0x00000000;
export const BITMAP_INKWIDTH = 0.7;
export const BITMAP_PADDING_X = 4;
export const BITMAP_PADDING_Y = 4;

export const TIMEOUT = 1500;         //  Timeout value for connecting to the port used for the SigCaptX service
export const SERVICEPORT = 8000;     //  Port used for the SigCaptX service
export const LICENCEKEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJMTVMiLCJleHAiOjE3NDI3MDU5NzMsImlhdCI6MTczNDkyOTk3Mywic2VhdHMiOjAsInJpZ2h0cyI6WyJTSUdfU0RLX0NPUkUiLCJUT1VDSF9TSUdOQVRVUkVfRU5BQkxFRCIsIlNJR0NBUFRYX0FDQ0VTUyIsIlNJR19TREtfSVNPIiwiU0lHX1NES19FTkNSWVBUSU9OIl0sImRldmljZXMiOltdLCJ0eXBlIjoiZXZhbCIsImxpY19uYW1lIjoiV2Fjb21fSW5rX1NES19mb3Jfc2lnbmF0dXJlIiwid2Fjb21faWQiOiIzYzhjMWQ4Y2MwY2I0NDljYWM3MjYxMjhjNGRkNWU4MCIsImxpY191aWQiOiJjODA1Nzc1OS05YjI3LTRlNjItYTljZi0yNTdhNWYwYWNiMzEiLCJhcHBzX3dpbmRvd3MiOltdLCJhcHBzX2lvcyI6W10sImFwcHNfYW5kcm9pZCI6W10sIm1hY2hpbmVfaWRzIjpbXSwid3d3IjpbXSwiYmFja2VuZF9pZHMiOltdfQ.sQ_pc1Er7O4nUKC91jShjGN2_GECWmQ_DiSvLL-S_Bpinpo6F2ltQ5ODexjaIq1ecbuPu8wE4jw6xpAzmtny4tkqQXPgDtMD4NF3CIBX5mwOVGVwmnfK1iNxecFOJMdgmhYQMuRX_sIRYnG9z0uAhnAVwFHmTWJfQk5-cloQNGTy-JFWL5NSg1gcv2ZsCYhlYRgs1v3Z3iT1WvEQxKJm_F9O0xuP5_qFOPInQAKDHHi-HnoW5u5YhEUG1hA2lyQ66SnXPR8wtq8_oZ0UySD6pey76N35iXYZKrNl_XoL_h_CtMj3bZn-7R8em3EABo_TMKsH9wauEmJz4U9MJqiyJg";
// Licence key used for sigCtl and wizCtl in SigCaptX-SessionControl.js

export class HTMLIds
{
  btnRestore:any;
  checkBoxUseB64:any;
  checkShowSigtext:any;
  firstName:any;
  imageBox:any;
  lastName:any;
  textSig:any;
  txtDisplay:any;

  constructor()
  {
    // Set up static properties for the HTML fields which are needed later
    this.btnRestore = (<HTMLButtonElement>document.getElementById("restore"));
    this.checkBoxUseB64 = (<HTMLInputElement>document.getElementById("chkUseB64Image"));
    this.checkShowSigtext = (<HTMLInputElement>document.getElementById("chkShowSigText"));
    this.firstName = (<HTMLElement>document.getElementById("fname"));
    this.imageBox = (<HTMLElement>document.getElementById("imageBox"));
    this.lastName = (<HTMLElement>document.getElementById("lname"));
    this.textSig = (<HTMLElement>document.getElementById("txtSignature"));
    this.txtDisplay = (<HTMLElement>document.getElementById("txtDisplay"));
  }
}



