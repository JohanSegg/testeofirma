/* **************************************************************************
  capture.ts
   
  This file contains the source code for capturing a signature.
  The "capturesig()" function is activated by the click event on the 
  Capture button on the form which is defined in btncapture.html
  
  Copyright (c) 2021 Wacom Co. Ltd. All rights reserved.
  
  v1.0
  
***************************************************************************/
import { Component } from '@angular/core';
import { HTMLIds } from "./SigCaptX-Globals";
import { BITMAP_BACKGROUNDCOLOR, BITMAP_IMAGEFORMAT, BITMAP_INKCOLOR, BITMAP_INKWIDTH, BITMAP_PADDING_X, BITMAP_PADDING_Y} from './SigCaptX-Globals';
import { SessionControl } from './SigCaptX-SessionControl';


declare global {
  interface Window {
      JSONreq: any;
      sdkPtr: any;  
    }
}

@Component({
  selector: 'btn-capture',
  templateUrl: './btncapture.html'
})


export class SigCapture 
{
    static callbackFunc:any;
    static dynCapt:any;
    static hash:any;
    static sigCtl: any;
    static sigObj: any;

    static HTMLTagIds = new HTMLIds();  // Set up the array of HTML tags which refer to the various HTML elements on the form

    capturesig()
    {        
      console.log("xd");
        if(null != SigCapture.HTMLTagIds.imageBox.firstChild)
        {
          SigCapture.HTMLTagIds.imageBox.removeChild(SigCapture.HTMLTagIds.imageBox.firstChild);
        }

        if (window.sdkPtr.running) 
        {
          SigCapture.Capture();
        }
        else
        {
          SessionControl.actionWhenRestarted();
          return;
        }
    }    
    
    static print(txt:string)   // Outputs a text string to the message display text box on the main form
    {
      SigCapture.HTMLTagIds.txtDisplay.value += txt + "\n";
      SigCapture.HTMLTagIds.txtDisplay.scrollTop = SigCapture.HTMLTagIds.txtDisplay.scrollHeight; // scroll to end
    }

    static callbackStatusOK ( methodName, status )  // Error handler routine for return values from callbacks
    {
      if(window.sdkPtr.ResponseStatus.OK === status)
      {
        return true;
      }
      else
      {
        SigCapture.print(methodName + " error: " + status);
        return false;
      }
    }

    static Capture()
    {       
        // Construct a hash object to contain the hash
        SigCapture.hash = new window.sdkPtr.Hash(SigCapture.onHashConstructor);
    }

    static onHashConstructor(hashV, status)
    {
        if(window.sdkPtr.ResponseStatus.OK == status)
        {
            SigCapture.GetHash(hashV, SigCapture.onGetInitialHash);
        }
        else
        {
            SigCapture.print("Hash Constructor error: " + status);
            if(window.sdkPtr.ResponseStatus.INVALID_SESSION == status)
            {
                SigCapture.print("Error: invalid session. Restarting the session.");
                SessionControl.actionWhenRestarted();
            }
        }
    }

    
    // Once the hash value has been calculated successfully next step is to capture the signature
    static onGetInitialHash = () =>
    {
        var firstName = SigCapture.HTMLTagIds.firstName.value;
        var lastName = SigCapture.HTMLTagIds.lastName.value;
        var fullName = firstName + " " + lastName;
        
        SigCapture.dynCapt.Capture(SigCapture.sigCtl, fullName, "Document Approval",  SigCapture.hash, null, SigCapture.onDynCaptCapture);
    }

    static onDynCaptCapture = (dynCaptV, SigObjV, status) =>
    {
        if(window.sdkPtr.ResponseStatus.INVALID_SESSION == status)
        {
            SigCapture.print("Error: invalid session. Restarting the session.");
            SessionControl.actionWhenRestarted();  // See SigCaptX-SessionControl.ts
        }
        else
        {
            /* Check the status returned from the signature capture */
            switch( status ) 
            {
                case window.sdkPtr.DynamicCaptureResult.DynCaptOK:
                SigCapture.sigObj = SigObjV;  // Populate the sigObj static property for later use
                SigCapture.print("Signature captured successfully");

                /* Set the RenderBitmap flags as appropriate depending on whether the user wants to use a picture image or B64 text value */
                if (SigCapture.HTMLTagIds.checkBoxUseB64.checked)
                {
                    var outputFlags = window.sdkPtr.RBFlags.RenderOutputBase64 | window.sdkPtr.RBFlags.RenderColor32BPP;
                } 
                else
                {
                    var outputFlags = window.sdkPtr.RBFlags.RenderOutputPicture | window.sdkPtr.RBFlags.RenderColor32BPP;
                }
                SigObjV.RenderBitmap(BITMAP_IMAGEFORMAT, 
                  SigCapture.HTMLTagIds.imageBox.clientWidth, 
                  SigCapture.HTMLTagIds.imageBox.clientHeight, 
                  BITMAP_INKWIDTH, 
                  BITMAP_INKCOLOR, 
                  BITMAP_BACKGROUNDCOLOR, 
                  outputFlags, 
                  BITMAP_PADDING_X, 
                  BITMAP_PADDING_Y, 
                  SigCapture.onRenderBitmap);
                break;

                case window.sdkPtr.DynamicCaptureResult.DynCaptCancel:
                SigCapture.print("Signature capture cancelled");
                break;
                
                case window.sdkPtr.DynamicCaptureResult.DynCaptPadError:
                SigCapture.print("No capture service available");
                break;
                
                case window.sdkPtr.DynamicCaptureResult.DynCaptError:
                SigCapture.print("Tablet Error");
                break;
                
                case window.sdkPtr.DynamicCaptureResult.DynCaptNotLicensed:
                SigCapture.print("No valid Signature Capture licence found");
                break;
                
                default: 
                SigCapture.print("Capture Error " + status);
                break;
            }
        }
    }
        
    static onRenderBitmap = (sigObjV, bmpObj, status) =>   // Handles the output of the RenderBitmap() function
    {
        if(SigCapture.callbackStatusOK("Signature Render Bitmap", status))  
        {
            // let imageData: string;

            /* If the user wants to demonstrate the use of B64 image strings then define an image and set its source to the B64 string*/
            if (SigCapture.HTMLTagIds.checkBoxUseB64.checked)
            {
                SigCapture.print("base64_image:>"+bmpObj+"<");
                let img = new Image();
                img.src = "data:image/png;base64," + bmpObj;
                console.log("bmpObj img");
                console.log(bmpObj); // esto de auqi mei mprime el formato correcto ahoran eceist que lo envies al backend 
                SigCapture.sendImageToServer(bmpObj, "bmp");

                if(null == SigCapture.HTMLTagIds.imageBox.firstChild)
                {
                    SigCapture.HTMLTagIds.imageBox.appendChild(img);
                }
                else
                {
                    SigCapture.HTMLTagIds.imageBox.replaceChild(img, SigCapture.HTMLTagIds.imageBox.firstChild);
                }
            }
            else
            {
                /* If RenderBitmap generated a standard image (picture) then just place that picture in the img control on the HTML form */
                if(null == SigCapture.HTMLTagIds.imageBox.firstChild)
                {
                  // alert(bmpObj);
                  console.log(bmpObj); 
                  console.log("bmpObj"); 

                  // alert(bmpObj.image);
                  console.log("bmpObj.image");
                  console.log(bmpObj.image);
                  // <img src="data:image/bmp;base64,/qamp/5iYmP/d3d3t7e3/2BgYP8lJSX/Kysr/3t7e//p6en5+fn//y4uLvr6+v+mpqb/X19f/0FBQf8/Pz//MDAw/xsbG/83Nzf/X19f/+zs7Pv7+//kZGR/1JSUv9FRUX/SUlJ/0xMTP85OTn/Ozs7/0lJSf+np6f4ODg/3Fxcf9SUlL/QkJC/0tLS/9tbW3/ioqK/0JCQv8+Pj7/Y2Nj//Ly8v87Ozv9kZGT/R0dH/0NDQ/9ZWVn/ioqK/9XV1f9TU1P/Pz8//0dHR/+vr6z8/P+xsbH/Xl5e/0pKSv9CQkL/Tk5O/6Ojo//09PT/l5eX/0JCQv8/Pz//ZWVl//Pz88/Pz/ra2t/1ZWVv9FRUX/R0dH/15eXv+6urr//////+Dg4P9eXl7/Pz8//0JCQv+2trb9fX1/5qamv9RUVH/RkZG/0hISP9iYmL/zs7O//z8/P//////nZ2d/0ZGRv9AQED/aWlp//Ly8v//////////////////////////////////
                   
                  // Crear un elemento canvas para procesar el contenido de bmpObj.image
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.width = SigCapture.HTMLTagIds.imageBox.clientWidth;
                  canvas.height = SigCapture.HTMLTagIds.imageBox.clientHeight;
                // Dibujar la imagen en el canvas
                context.drawImage(bmpObj.image, 0, 0);

        // Convertir el contenido del canvas a Base64 (formato BMP)
        const base64Image = canvas.toDataURL('image/bmp');
        console.log("Converted BMP to Base64:", base64Image);

        // Enviar la imagen BMP al backend
        SigCapture.sendImageToServer(base64Image.split(',')[1], "bmp");


                  SigCapture.HTMLTagIds.imageBox.appendChild(bmpObj.image);
                }
                else
                {
                    SigCapture.HTMLTagIds.imageBox.replaceChild(bmpObj.image, SigCapture.HTMLTagIds.imageBox.firstChild);
                }
            }
            /* If the user chose the option to show the SigText value on the form then call the function to do this */
            var checkShowSigtext = (<HTMLInputElement>document.getElementById("chkShowSigText"));
            if (checkShowSigtext.checked)
            {
                sigObjV.GetSigText(SigCapture.onGetSigText);
            }
        } 
    }
    static sendImageToServer(imageData: string, format: string) {
      fetch('http://localhost:8000/api-cso/firmita', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              image: imageData, // La imagen en formato Base64
              format: format,   // "bmp"
          }),
      })
          .then((response) => {
              if (response.ok) {
                  console.log("Imagen BMP enviada correctamente al servidor.");
              } else {
                  console.error("Error al enviar la imagen BMP al servidor.");
              }
          })
          .catch((error) => {
              console.error("Error en la solicitud:", error);
          });
  }
  
        
    /* This function takes the SigText value returned by the callback and places it in the txtSignature tag on the form */
    static onGetSigText = (sigObjV, text, status) =>
    {
        if(SigCapture.callbackStatusOK("Signature Render Bitmap", status))
        {
            SigCapture.HTMLTagIds.textSig.value = text;
        }
    }

    static GetHash = (hash, callback) =>
    {
      SigCapture.callbackFunc = callback;
  
      SigCapture.print("Creating hash:");
      hash.Clear(SigCapture.onClear);   // Clear any pre-existing hash value before creating a new one
    }
  
    static onClear = (hashV, status) =>
    {
      if(SigCapture.callbackStatusOK("Hash Clear", status))
      {
        hashV.PutType(window.sdkPtr.HashType.HashMD5, SigCapture.onPutType);
      } 
    }
      
    static onPutType = (hashV, status) =>
    {
      if(SigCapture.callbackStatusOK("Hash PutType", status))
      {
        var vFname = new window.sdkPtr.Variant();
        vFname.Set(SigCapture.HTMLTagIds.firstName.value);
        hashV.Add(vFname, SigCapture.onAddFname);  // Add the first name to the hash
      } 
    }
      
    static onAddFname = (hashV, status) =>
    {
      if(SigCapture.callbackStatusOK("Hash Add", status))
      {
        var vLname = new window.sdkPtr.Variant();
        vLname.Set(SigCapture.HTMLTagIds.lastName.value);
        hashV.Add(vLname, SigCapture.onAddLname);  // Add the surname to the hash
      } 
    }
      
    static onAddLname = (hashV, status) =>
    {
      if(SigCapture.callbackStatusOK("Hash Add", status))
      {
        SigCapture.callbackFunc();
      } 
    }
}