import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'TakeJustName'
})

export class NamePipe implements PipeTransform{
	transform(fullName: string, separator: string, index: number): string{
		return fullName? fullName.split(separator)[index] : null;
	}
}